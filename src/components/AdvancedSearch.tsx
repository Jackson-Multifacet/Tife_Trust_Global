import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X, Filter, Calendar, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onClear: () => void;
}

export interface SearchFilters {
  searchQuery: string;
  status: string;
  startDate: string;
  endDate: string;
  minAmount: number | null;
  maxAmount: number | null;
  assignedStaff: string;
}

export default function AdvancedSearch({
  onSearch,
  onClear,
}: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    searchQuery: "",
    status: "all",
    startDate: "",
    endDate: "",
    minAmount: null,
    maxAmount: null,
    assignedStaff: "all",
  });

  const [isExpanded, setIsExpanded] = useState(false);

  const hasActiveFilters =
    filters.searchQuery ||
    filters.status !== "all" ||
    filters.startDate ||
    filters.endDate ||
    filters.minAmount ||
    filters.maxAmount ||
    filters.assignedStaff !== "all";

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const updatedFilters = { ...filters, [key]: value };
    setFilters(updatedFilters);
    onSearch(updatedFilters);
  };

  const handleClear = () => {
    const clearedFilters: SearchFilters = {
      searchQuery: "",
      status: "all",
      startDate: "",
      endDate: "",
      minAmount: null,
      maxAmount: null,
      assignedStaff: "all",
    };
    setFilters(clearedFilters);
    onClear();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Basic Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or application ID..."
                value={filters.searchQuery}
                onChange={(e) =>
                  handleFilterChange("searchQuery", e.target.value)
                }
                className="pl-9"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              {isExpanded ? "Hide" : "Show"} Filters
              {hasActiveFilters && (
                <Badge variant="secondary" className="ml-2">
                  Active
                </Badge>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="space-y-4"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Advanced Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Status Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">Status</label>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                    <SelectItem value="under-review">Under Review</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range Filter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    From Date
                  </label>
                  <Input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) =>
                      handleFilterChange("startDate", e.target.value)
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    To Date
                  </label>
                  <Input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) =>
                      handleFilterChange("endDate", e.target.value)
                    }
                  />
                </div>
              </div>

              {/* Amount Range Filter */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Min Amount (₦)
                  </label>
                  <Input
                    type="number"
                    placeholder="0"
                    value={filters.minAmount || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "minAmount",
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Max Amount (₦)
                  </label>
                  <Input
                    type="number"
                    placeholder="999999999"
                    value={filters.maxAmount || ""}
                    onChange={(e) =>
                      handleFilterChange(
                        "maxAmount",
                        e.target.value ? parseFloat(e.target.value) : null,
                      )
                    }
                  />
                </div>
              </div>

              {/* Staff Assignment Filter */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Assigned Staff
                </label>
                <Select
                  value={filters.assignedStaff}
                  onValueChange={(value) =>
                    handleFilterChange("assignedStaff", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Staff</SelectItem>
                    <SelectItem value="unassigned">Unassigned</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters Button */}
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  onClick={handleClear}
                  className="w-full gap-2"
                >
                  <X className="h-4 w-4" />
                  Clear All Filters
                </Button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}
