import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { SlidersHorizontal, X } from "lucide-react"
import { ClassSelect } from "./ClassSelect"
import { ModeSwitcher } from "@/components/ModeSwitcher"

export function FiltersCard({
  search,
  setSearch,
  selectedClass,
  setSelectedClass,
  dateFilter,
  setDateFilter,
  classes,
}: {
  search: string
  setSearch: (val: string) => void
  selectedClass: string
  setSelectedClass: (val: string) => void
  dateFilter: string
  setDateFilter: (val: string) => void
  classes: string[]
}) {

  return (
    <Card className="bg-card text-card-foreground border border-border shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
          Filters
        </CardTitle>

        {/* Reset button for mobile convenience */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setSearch("")
            setSelectedClass("")
            setDateFilter("")
          }}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="w-4 h-4 mr-1" />
          Clear
        </Button>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search">Mode</Label>
            <ModeSwitcher />
          </div>
          
          {/* Search Field */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search anything...`}
              className="bg-background focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Class Dropdown */}
          <ClassSelect
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            classes={classes}
          />

          {/* Date Filter */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-background focus:ring-2 focus:ring-ring"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
