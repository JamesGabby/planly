// components/lesson-plans/PrintPreviewDialog.tsx
"use client";

import { useState, useRef, useCallback } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Printer,
  Download,
  FileText,
  Settings2,
  Eye,
  Loader2,
  Check,
  Copy,
  Smartphone,
  Monitor,
  LayoutTemplate,
} from "lucide-react";
import { LessonPlanTeacher } from "@/app/dashboard/lesson-plans/types/lesson_teacher";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface PrintSection {
  id: string;
  label: string;
  icon: React.ReactNode;
  enabled: boolean;
}

interface PrintPreviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lesson: LessonPlanTeacher;
  generatePrintContent: (sections: string[], options: PrintOptions) => string;
}

interface PrintOptions {
  paperSize: "a4" | "letter" | "legal";
  orientation: "portrait" | "landscape";
  fontSize: "small" | "medium" | "large";
  includeHeader: boolean;
  includeFooter: boolean;
  colorMode: "color" | "grayscale";
}

const defaultSections: PrintSection[] = [
  { id: "header", label: "Header & Meta Info", icon: <LayoutTemplate size={16} />, enabled: true },
  { id: "objectives", label: "Objectives & Outcomes", icon: <FileText size={16} />, enabled: true },
  { id: "structure", label: "Lesson Structure", icon: <FileText size={16} />, enabled: true },
  { id: "details", label: "Additional Details", icon: <FileText size={16} />, enabled: true },
  { id: "resources", label: "Resources", icon: <FileText size={16} />, enabled: true },
  { id: "homework", label: "Homework", icon: <FileText size={16} />, enabled: true },
  { id: "evaluation", label: "Evaluation & Notes", icon: <FileText size={16} />, enabled: false },
];

export function PrintPreviewDialog({
  open,
  onOpenChange,
  lesson,
  generatePrintContent,
}: PrintPreviewDialogProps) {
  const [sections, setSections] = useState<PrintSection[]>(defaultSections);
  const [activeTab, setActiveTab] = useState<"preview" | "settings">("preview");
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const previewRef = useRef<HTMLIFrameElement>(null);

  const [options, setOptions] = useState<PrintOptions>({
    paperSize: "a4",
    orientation: "portrait",
    fontSize: "medium",
    includeHeader: true,
    includeFooter: true,
    colorMode: "color",
  });

  const enabledSections = sections.filter((s) => s.enabled).map((s) => s.id);

  const toggleSection = (id: string) => {
    setSections((prev) =>
      prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
    );
  };

  const selectAllSections = () => {
    setSections((prev) => prev.map((s) => ({ ...s, enabled: true })));
  };

  const deselectAllSections = () => {
    setSections((prev) =>
      prev.map((s) => (s.id === "header" ? s : { ...s, enabled: false }))
    );
  };

  const handlePrint = useCallback(async () => {
    setIsExporting(true);
    
    try {
      const content = generatePrintContent(enabledSections, options);
      const printWindow = window.open("", "_blank", "width=800,height=600");
      
      if (!printWindow) {
        throw new Error("Popup blocked");
      }

      printWindow.document.write(content);
      printWindow.document.close();
      
      // Wait for content to load
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      printWindow.focus();
      printWindow.print();
      
      // Close after a delay to allow print dialog to appear
      setTimeout(() => {
        printWindow.close();
      }, 1000);

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error("Print error:", error);
    } finally {
      setIsExporting(false);
    }
  }, [enabledSections, options, generatePrintContent]);

  const handleExportPDF = useCallback(async () => {
    setIsExporting(true);
    
    try {
      const content = generatePrintContent(enabledSections, options);
      const printWindow = window.open("", "_blank");
      
      if (!printWindow) {
        throw new Error("Popup blocked");
      }

      printWindow.document.write(content);
      printWindow.document.close();
      
      // For PDF, suggest using the browser's "Save as PDF" option
      await new Promise((resolve) => setTimeout(resolve, 500));
      printWindow.focus();
      printWindow.print();

      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error("PDF export error:", error);
    } finally {
      setIsExporting(false);
    }
  }, [enabledSections, options, generatePrintContent]);

  const handleCopyToClipboard = useCallback(async () => {
    setIsExporting(true);
    
    try {
      // Generate plain text version
      const plainText = generatePlainTextContent(lesson, enabledSections);
      await navigator.clipboard.writeText(plainText);
      
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 2000);
    } catch (error) {
      console.error("Copy error:", error);
    } finally {
      setIsExporting(false);
    }
  }, [lesson, enabledSections]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0 gap-0">
        {/* Header */}
        <DialogHeader className="px-6 py-4 border-b bg-muted/30">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl font-semibold flex items-center gap-2">
                <Printer className="h-5 w-5 text-primary" />
                Print & Export
              </DialogTitle>
              <DialogDescription className="mt-1">
                Customize and preview your lesson plan before printing
              </DialogDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                {enabledSections.length} sections selected
              </Badge>
            </div>
          </div>
        </DialogHeader>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Sidebar - Settings */}
          <div className="w-80 border-r bg-muted/20 flex flex-col">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "preview" | "settings")} className="flex-1 flex flex-col">
              <TabsList className="w-full rounded-none border-b bg-transparent h-12 p-0">
                <TabsTrigger
                  value="preview"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Sections
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex-1 rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
                >
                  <Settings2 className="h-4 w-4 mr-2" />
                  Settings
                </TabsTrigger>
              </TabsList>

              <TabsContent value="preview" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Include Sections</span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={selectAllSections}
                          className="h-7 text-xs"
                        >
                          All
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={deselectAllSections}
                          className="h-7 text-xs"
                        >
                          None
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {sections.map((section) => (
                        <motion.div
                          key={section.id}
                          initial={false}
                          animate={{
                            backgroundColor: section.enabled
                              ? "hsl(var(--primary) / 0.05)"
                              : "transparent",
                          }}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer hover:border-primary/50",
                            section.enabled
                              ? "border-primary/30"
                              : "border-transparent"
                          )}
                          onClick={() => toggleSection(section.id)}
                        >
                          <Checkbox
                            checked={section.enabled}
                            onCheckedChange={() => toggleSection(section.id)}
                            disabled={section.id === "header"}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <span className="text-muted-foreground">
                              {section.icon}
                            </span>
                            <span className="text-sm font-medium">
                              {section.label}
                            </span>
                          </div>
                          {section.enabled && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="settings" className="flex-1 m-0 overflow-hidden">
                <ScrollArea className="h-full">
                  <div className="p-4 space-y-6">
                    {/* Paper Size */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Paper Size</Label>
                      <RadioGroup
                        value={options.paperSize}
                        onValueChange={(v) =>
                          setOptions((prev) => ({
                            ...prev,
                            paperSize: v as PrintOptions["paperSize"],
                          }))
                        }
                        className="grid grid-cols-3 gap-2"
                      >
                        {[
                          { value: "a4", label: "A4" },
                          { value: "letter", label: "Letter" },
                          { value: "legal", label: "Legal" },
                        ].map((size) => (
                          <Label
                            key={size.value}
                            className={cn(
                              "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                              options.paperSize === size.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <RadioGroupItem
                              value={size.value}
                              className="sr-only"
                            />
                            <span className="text-sm">{size.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Orientation */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Orientation</Label>
                      <RadioGroup
                        value={options.orientation}
                        onValueChange={(v) =>
                          setOptions((prev) => ({
                            ...prev,
                            orientation: v as PrintOptions["orientation"],
                          }))
                        }
                        className="grid grid-cols-2 gap-2"
                      >
                        {[
                          { value: "portrait", label: "Portrait", icon: "📄" },
                          { value: "landscape", label: "Landscape", icon: "📃" },
                        ].map((orient) => (
                          <Label
                            key={orient.value}
                            className={cn(
                              "flex items-center justify-center gap-2 p-3 rounded-lg border cursor-pointer transition-all",
                              options.orientation === orient.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <RadioGroupItem
                              value={orient.value}
                              className="sr-only"
                            />
                            <span>{orient.icon}</span>
                            <span className="text-sm">{orient.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    {/* Font Size */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">Font Size</Label>
                      <RadioGroup
                        value={options.fontSize}
                        onValueChange={(v) =>
                          setOptions((prev) => ({
                            ...prev,
                            fontSize: v as PrintOptions["fontSize"],
                          }))
                        }
                        className="grid grid-cols-3 gap-2"
                      >
                        {[
                          { value: "small", label: "Small" },
                          { value: "medium", label: "Medium" },
                          { value: "large", label: "Large" },
                        ].map((size) => (
                          <Label
                            key={size.value}
                            className={cn(
                              "flex items-center justify-center p-3 rounded-lg border cursor-pointer transition-all",
                              options.fontSize === size.value
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            )}
                          >
                            <RadioGroupItem
                              value={size.value}
                              className="sr-only"
                            />
                            <span className="text-sm">{size.label}</span>
                          </Label>
                        ))}
                      </RadioGroup>
                    </div>

                    <Separator />

                    {/* Additional Options */}
                    <div className="space-y-3">
                      <Label className="text-sm font-medium">
                        Additional Options
                      </Label>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="include-header"
                            className="text-sm cursor-pointer"
                          >
                            Include page header
                          </Label>
                          <Checkbox
                            id="include-header"
                            checked={options.includeHeader}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                includeHeader: checked as boolean,
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="include-footer"
                            className="text-sm cursor-pointer"
                          >
                            Include page numbers
                          </Label>
                          <Checkbox
                            id="include-footer"
                            checked={options.includeFooter}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                includeFooter: checked as boolean,
                              }))
                            }
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label
                            htmlFor="color-mode"
                            className="text-sm cursor-pointer"
                          >
                            Print in grayscale
                          </Label>
                          <Checkbox
                            id="color-mode"
                            checked={options.colorMode === "grayscale"}
                            onCheckedChange={(checked) =>
                              setOptions((prev) => ({
                                ...prev,
                                colorMode: checked ? "grayscale" : "color",
                              }))
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Right Side - Preview */}
          <div className="flex-1 flex flex-col bg-muted/40">
            {/* Preview Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b bg-background">
              <div className="flex items-center gap-2">
                <Button
                  variant={previewDevice === "desktop" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewDevice("desktop")}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewDevice === "mobile" ? "secondary" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewDevice("mobile")}
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
              <span className="text-xs text-muted-foreground">
                Live Preview
              </span>
            </div>

            {/* Preview Container */}
            <div className="flex-1 p-6 overflow-auto flex items-start justify-center">
              <motion.div
                layout
                className={cn(
                  "bg-white shadow-2xl rounded-lg overflow-hidden transition-all duration-300",
                  previewDevice === "desktop"
                    ? "w-full max-w-[800px]"
                    : "w-[375px]"
                )}
                style={{
                  aspectRatio:
                    options.orientation === "portrait" ? "210/297" : "297/210",
                  maxHeight: "calc(100% - 2rem)",
                }}
              >
                <iframe
                  ref={previewRef}
                  srcDoc={generatePrintContent(enabledSections, options)}
                  className="w-full h-full border-0"
                  title="Print Preview"
                />
              </motion.div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <DialogFooter className="px-6 py-4 border-t bg-muted/30">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleCopyToClipboard}
                disabled={isExporting}
              >
                <Copy className="h-4 w-4 mr-2" />
                Copy Text
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <AnimatePresence>
                {exportSuccess && (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <Check className="h-4 w-4" />
                    <span className="text-sm">Success!</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <Button
                variant="outline"
                onClick={handleExportPDF}
                disabled={isExporting}
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export PDF
              </Button>

              <Button onClick={handlePrint} disabled={isExporting}>
                {isExporting ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Printer className="h-4 w-4 mr-2" />
                )}
                Print
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Helper function to generate plain text for clipboard
function generatePlainTextContent(
  lesson: LessonPlanTeacher,
  sections: string[]
): string {
  let text = "";

  if (sections.includes("header")) {
    text += `LESSON PLAN\n`;
    text += `${"=".repeat(50)}\n\n`;
    text += `Topic: ${lesson.topic || "Untitled"}\n`;
    text += `Class: ${lesson.class}\n`;
    text += `Year Group: ${lesson.year_group}\n`;
    if (lesson.exam_board) text += `Exam Board: ${lesson.exam_board}\n`;
    text += `Date: ${lesson.date_of_lesson}\n`;
    if (lesson.time_of_lesson) text += `Time: ${lesson.time_of_lesson}\n`;
    text += `\n`;
  }

  if (sections.includes("objectives") && lesson.objectives) {
    text += `OBJECTIVES\n${"-".repeat(30)}\n${lesson.objectives}\n\n`;
  }

  if (sections.includes("objectives") && lesson.outcomes) {
    text += `OUTCOMES\n${"-".repeat(30)}\n${lesson.outcomes}\n\n`;
  }

  // Add more sections as needed...

  return text;
}