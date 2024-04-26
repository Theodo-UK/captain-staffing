import { Badge } from "../badge";
import { Separator } from "../separator";
import { Option } from "./MultiSelect.types";

const MAX_SELECTED_OPTIONS_BEFORE_GROUPED = 3;

interface MultiSelectBadgesProps {
  selectedOptions: Option[];
  showSelected: boolean;
}

export const MultiSelectBadges: React.FC<MultiSelectBadgesProps> = ({ selectedOptions, showSelected }) => {

  if (!showSelected || selectedOptions.length === 0) {
    return null;
  }

  return (
    <>
      <Separator orientation="vertical" className="mx-2 h-4" />
      <Badge
        variant="secondary"
        className="rounded-sm px-1 font-normal lg:hidden"
      >
        {selectedOptions.length}
      </Badge>
      <div className="hidden space-x-1 lg:flex">
        {selectedOptions.length > MAX_SELECTED_OPTIONS_BEFORE_GROUPED ? (
          <Badge
            variant="secondary"
            className="rounded-sm px-1 font-normal"
          >
            {selectedOptions.length} selected
          </Badge>
        ) : (
          selectedOptions
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
  );
};
