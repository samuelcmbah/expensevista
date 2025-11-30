import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

//for merging tailwind classes. Handles conflicts and deduplications.
//usage: cn("class1", condition && "class2", "class3")
//in select component
export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}
