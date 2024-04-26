import * as React from "react";
import { CheckIcon, PlusCircledIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
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
import { Option } from "./MultiSelect.types";
import { MultiSelectBadges } from "./MultiSelect.badges";


interface MultiSelectProps {
  clearFilter?: () => void;
  selectAll?: () => void;
  toggleOption: (value: string) => void;
  title?: string;
  options: Option[];
  showSelected?: boolean;
  Icon?: React.ComponentType<{ className?: string }>;
}

export function MultiSelect({
  clearFilter,
  selectAll,
  toggleOption,
  title,
  options,
  showSelected = true,
  Icon = PlusCircledIcon
}: MultiSelectProps) {
  const selectedValues = new Set(
    options.filter((o) => o.isSelected).map((o) => o.value)
  );

  const selectedOptions = options
    .filter((option) => selectedValues.has(option.value));

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Icon className="mr-2 h-4 w-4" />
          {title}
          <MultiSelectBadges showSelected={showSelected} selectedOptions={selectedOptions} />
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
