import React from "react";
import { useCheckbox, Chip, VisuallyHidden, tv } from "@nextui-org/react";

const checkbox = tv({
  slots: {
    base: "border-default hover:bg-default-200 ",
    content: "text-default-500 text-xs cursor-pointer",
  },
  variants: {
    isSelected: {
      true: {
        base: "border-primary bg-primary hover:bg-primary-500 hover:border-primary-500",
        content: "text-primary-foreground pl-1",
      },
      false: {
        base: "border-default hover:bg-default-200",
        content: "text-default-500"
      }
    },
    isFocusVisible: {
      true: {
        base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
      },
    },
  },
});
interface FilterChipPros{
      children?: React.ReactNode;
    value: string
    handleFilterClick: (value:any) => any
}
export const FilterChip = ({value, handleFilterClick}:FilterChipPros) => {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({});
  console.log("isslected",isSelected);
  
  const styles = checkbox({ isSelected, isFocusVisible });
  const handleChipClick = () => {
    handleFilterClick(value);
  };
  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()}/>
      </VisuallyHidden>
      <Chip
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        size="md"
        className=""
        color="primary"
        variant="faded"
        
      >
        {value ? value : isSelected ? "Enabled" : "Disabled"}
      </Chip>
    </label>
    // <label {...getBaseProps()}>
    //   <VisuallyHidden>
    //     <input {...getInputProps()} />
    //   </VisuallyHidden>
    //   <Chip
    //     classNames={{
    //       base: styles.base(),
    //       content: styles.content(),
    //     }}
    //     size="md" className=""
    //     color="primary"
    //     variant="faded"
    //     {...getLabelProps()}
    //   >
    //     {value}
    //     {/* {children ? children : isSelected ? "Enabled" : "Disabled"} */}
    //   </Chip>
    // </label>
  );
};
