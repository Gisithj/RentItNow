import React from "react";
import { useCheckbox, Chip, VisuallyHidden, tv } from "@nextui-org/react";
import { log } from "console";

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
}

export const FilterChip = (props:FilterChipPros) => {  
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    ...props
  })
  // console.log("isslected",isSelected);
  
  const styles = checkbox({ isSelected, isFocusVisible });
  // const handleChipClick = () => {
  //   handleFilterClick(value);
  // };
  
  
  
  
  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
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
        {/* {value} */}
        {children ? children : isSelected ? "Enabled" : "Disabled"}
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
