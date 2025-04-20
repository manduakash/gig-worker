"use client";

import React, { useRef, useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

/**
 * A multi-select component that allows the user to select multiple options.
 *
 * Props:
 * - options: Array of options. Each option can be a primitive (string/number) or an object.
 * - selected: Array of selected options. When using objects, these should be the same shape as options.
 * - onChange: Callback invoked with the new selected array.
 * - placeholder: Placeholder text when nothing is selected.
 * - getOptionKey (optional): A function that returns a unique key for an option.
 * - getOptionLabel (optional): A function that returns the display label for an option.
 */
export function MultiSelect({
  options = [],
  selected = [],
  onChange,
  placeholder = "Select options...",
  getOptionKey = (option) =>
    typeof option === "object" && option !== null ? option.value : option,
  getOptionLabel = (option) =>
    typeof option === "object" && option !== null ? option.label : option,
}) {
  const containerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const handleUnselect = (option) => {
    onChange(selected.filter((s) => getOptionKey(s) !== getOptionKey(option)));
  };

  // Filter out options already selected by comparing their keys.
  const selectables = options.filter(
    (option) => !selected.some((s) => getOptionKey(s) === getOptionKey(option))
  );

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <Command
      ref={containerRef}
      className="overflow-visible bg-transparent"
      onClick={() => setOpen((prev) => !prev)}
    >
      <div className="group border border-input px-3 py-2 text-sm ring-offset-background rounded-md">
        <div className="flex gap-1 flex-wrap">
          {selected.map((option) => (
            <Badge key={getOptionKey(option)} variant="secondary">
              {getOptionLabel(option)}
              <button
                className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          {selected.length === 0 && (
            <button
              type="button"
              className="ml-2 bg-transparent outline-none text-sm text-muted-foreground"
            >
              {placeholder}
            </button>
          )}
        </div>
      </div>
      <div className="relative mt-2">
        {open && selectables.length > 0 && (
          <div className="absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => (
                  <CommandItem
                    key={getOptionKey(option)}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      onChange([...selected, option]);
                      setOpen(false);
                    }}
                    className="cursor-pointer"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        onChange([...selected, option]);
                        setOpen(false);
                      }
                    }}
                  >
                    {getOptionLabel(option)}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        )}
      </div>
    </Command>
  );
}
