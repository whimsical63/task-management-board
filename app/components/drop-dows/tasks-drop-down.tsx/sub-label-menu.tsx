import {
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuPortal,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Tag } from "lucide-react";
import { LABEL_OPTIONS } from "./constants";

interface LabelSubMenuProps {
  value: string;
  onValueChange: (value: string) => void;
  onClickedLabelItem: (value: string) => void; // Updated to accept the selected label
}

export function LabelSubMenu({
  value,
  onValueChange,
  onClickedLabelItem,
}: LabelSubMenuProps) {
  const handleValueChange = (newValue: string) => {
    // Update the selected label
    onValueChange(newValue);

    // Call the clickedLabelItem function with the new label
    onClickedLabelItem(newValue);
  };

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        <Tag className="mr-2 h-4 w-4" />
        <span>Label</span>
      </DropdownMenuSubTrigger>
      <DropdownMenuPortal>
        <DropdownMenuSubContent className="poppins">
          <DropdownMenuRadioGroup
            value={value}
            onValueChange={handleValueChange}
          >
            {LABEL_OPTIONS.map((option) => (
              <DropdownMenuRadioItem key={option} value={option}>
                {option}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuSubContent>
      </DropdownMenuPortal>
    </DropdownMenuSub>
  );
}
