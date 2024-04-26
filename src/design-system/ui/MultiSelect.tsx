import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Badge } from "@/design-system/ui/badge";
import { Button } from "@/design-system/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from "@/design-system/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from "@/design-system/ui/popover";
import { Separator } from "@/design-system/ui/separator";

const MAX_SELECTED_OPTIONS_BEFORE_GROUPED = 3;

interface MultiSelectProps {
  clearFilter?: () => void;
  selectAll?: () => void;
  toggleOption: (value: string) => void;
  title?: string;
  options: {
    label: string;
    value: string;
    isSelected: boolean;
    icon?: React.ComponentType<{ className?: string }>;
  }[];
}

export function MultiSelect({
  clearFilter,
  selectAll,
  toggleOption,
  title,
  options
}: MultiSelectProps) {
  const selectedValues = new Set(
    options.filter((o) => o.isSelected).map((o) => o.value)
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4" />
          {title}
          {selectedValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.size > MAX_SELECTED_OPTIONS_BEFORE_GROUPED ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.size} selected
                  </Badge>
                ) : (
                  options
                    .filter((option) => selectedValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandList className="max-h-[500px]">
            <CommandGroup>
              {options.map((option) => {
                const isSelected = selectedValues.has(option.value);
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        selectedValues.delete(option.value);
                      } else {
                        selectedValues.add(option.value);
                      }
                      toggleOption(option.value);
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")} />
                    </div>
                    {/* {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground" />
                    )} */}
                    <span>{option.label}</span>
                  </CommandItem>
                );
              })}
            </CommandGroup>
            <MultiSelectBottomOptions
              clearFilter={clearFilter}
              selectAll={selectAll}
            />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

interface MultiSelectBottomOptionsProps {
  clearFilter?: () => void;
  selectAll?: () => void;
}

const MultiSelectBottomOptions: React.FC<MultiSelectBottomOptionsProps> = ({
  clearFilter,
  selectAll
}) => {
  const showClearFilter = Boolean(clearFilter);
  const showSelectAll = Boolean(selectAll);

  if (!showClearFilter && !showSelectAll) {
    return null;
  }

  return (
    <>
      <CommandSeparator />
      <CommandGroup>
        {showClearFilter && (
          <CommandItem
            onSelect={clearFilter}
            className="justify-center text-center"
          >
            Clear filter
          </CommandItem>
        )}
        {showSelectAll && (
          <CommandItem
            onSelect={selectAll}
            className="justify-center text-center"
          >
            Select all
          </CommandItem>
        )}
      </CommandGroup>
    </>
  );
};
