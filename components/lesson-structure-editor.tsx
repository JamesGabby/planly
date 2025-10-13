"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export interface LessonStage {
  stage: string;
  duration: string;
  teaching: string;
  learning: string;
  assessing: string;
  adapting: string;
}

export function LessonStructureEditor({
  value,
  onChange,
}: {
  value: LessonStage[];
  onChange: (value: LessonStage[]) => void;
}) {
  const [stages, setStages] = useState<LessonStage[]>(value || []);

  const handleAdd = () => {
    const updated = [
      ...stages,
      { stage: "", duration: "", teaching: "", learning: "", assessing: "", adapting: "" },
    ];
    setStages(updated);
    onChange(updated);
  };

  const handleUpdate = (i: number, key: keyof LessonStage, val: string) => {
    const updated = stages.map((s, idx) => (idx === i ? { ...s, [key]: val } : s));
    setStages(updated);
    onChange(updated);
  };

  const handleRemove = (i: number) => {
    const updated = stages.filter((_, idx) => idx !== i);
    setStages(updated);
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Lesson Structure</h3>
        <Button type="button" variant="outline" onClick={handleAdd}>
          + Add Stage
        </Button>
      </div>

      {stages.length === 0 && <p className="text-slate-500 text-sm">No stages added yet.</p>}

      {stages.map((s, i) => (
        <div key={i} className="border rounded-xl p-4 bg-white shadow-sm space-y-3">
          <div className="flex justify-between gap-2">
            <Input
              placeholder="Stage (e.g. Starter)"
              value={s.stage}
              onChange={(e) => handleUpdate(i, "stage", e.target.value)}
              className="flex-1"
            />
            <Input
              placeholder="Duration (e.g. 10 min)"
              value={s.duration}
              onChange={(e) => handleUpdate(i, "duration", e.target.value)}
              className="w-32"
            />
          </div>

          {["teaching", "learning", "assessing", "adapting"].map((key) => (
            <div key={key}>
              <Label className="capitalize">{key}</Label>
              <Textarea
                rows={2}
                placeholder={`Describe the ${key}`}
                value={s[key as keyof LessonStage]}
                onChange={(e) => handleUpdate(i, key as keyof LessonStage, e.target.value)}
              />
            </div>
          ))}

          <div className="flex justify-end">
            <Button type="button" variant="destructive" size="sm" onClick={() => handleRemove(i)}>
              Remove
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
