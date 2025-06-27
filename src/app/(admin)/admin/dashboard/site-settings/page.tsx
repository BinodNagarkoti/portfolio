'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SaveIcon } from "lucide-react";

export default function SiteSettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Site Settings</h2>
        <p className="text-muted-foreground">
          Manage global settings for your portfolio.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Global site configurations. (Placeholder)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">Site settings management UI will be implemented here.</p>
           <Button type="submit" disabled className="w-full md:w-auto">
            <SaveIcon className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
