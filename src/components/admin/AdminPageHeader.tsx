import { Button } from "@/components/ui/button";
import { PlusCircleIcon } from "lucide-react";

interface AdminPageHeaderProps {
  title: string;
  description: string;
  buttonText: string;
  onAdd: () => void;
}

export function AdminPageHeader({ title, description, buttonText, onAdd }: AdminPageHeaderProps) {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
        <p className="text-muted-foreground">{description}</p>
      </div>
      <Button onClick={onAdd}>
        <PlusCircleIcon className="mr-2 h-4 w-4" /> {buttonText}
      </Button>
    </div>
  );
}
