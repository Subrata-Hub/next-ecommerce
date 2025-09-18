import { Loader2Icon } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const ButtonLoading = ({
  type,
  text,
  loading,
  className,
  onclick,
  ...props
}) => {
  return (
    <div>
      <Button
        type={type}
        size="sm"
        disabled={loading}
        onClick={onclick}
        className={cn("", className)}
        {...props}
      >
        {loading && <Loader2Icon className="animate-spin" />}

        {text}
      </Button>
    </div>
  );
};

export default ButtonLoading;
