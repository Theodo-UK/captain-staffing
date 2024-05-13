import { Badge } from "../badge";
import { Separator } from "../separator";
import { Option } from "./MultiSelect.types";

const MAX_SELECTED_OPTIONS_BEFORE_GROUPED = 3;

interface MultiSelectBadgesProps {
  selectedOptions: Option[];
  indeterminateOptions: Option[];
  showSelected: boolean;
}

export const MultiSelectBadges: React.FC<MultiSelectBadgesProps> = ({ selectedOptions, showSelected, indeterminateOptions }) => {
  const allOptions = [...selectedOptions, ...indeterminateOptions];

  if (!showSelected || allOptions.length === 0) {
    return null;
  }

  return (
    <>
      <Separator orientation="vertical" className="mx-2 h-4" />
      <Badge
        variant="secondary"
        className="rounded-sm px-1 font-normal lg:hidden"
      >
        {allOptions.length}
      </Badge>
      <div className="hidden space-x-1 lg:flex">
        {allOptions.length > MAX_SELECTED_OPTIONS_BEFORE_GROUPED ? (
          <Badge
            variant="secondary"
            className="rounded-sm px-1 font-normal"
          >
            {allOptions.length} selected
          </Badge>
        ) : (
          allOptions
            .map((option) => (
              <Badge
                variant={option.isSelected ? "secondary" : "outline"}
                key={option.value}
                className="rounded-sm px-1 font-normal"
              >
                {option.label}
              </Badge>
            ))
        )}
      </div>
    </>
  );
};
