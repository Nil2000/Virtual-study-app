import { Button } from "@repo/ui/components/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import React from "react";

export default function ChangePlayListDialog({
  changePlayList,
}: {
  changePlayList: (url: string) => void;
}) {
  const [url, setUrl] = React.useState<string>("");
  const handleChange = () => {
    if (!url) return;
    changePlayList(url);
  };
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Change Playlist</Button>
      </DialogTrigger>
      <DialogContent className="font-sans">
        <DialogHeader>
          <DialogTitle>Change Playlist</DialogTitle>
          <DialogDescription>Paste the full link</DialogDescription>
        </DialogHeader>
        <div>
          <Input
            placeholder="https://open.spotify.com/playlist/..."
            onChange={(e) => {
              setUrl(e.target.value);
            }}
            value={url}
          />
        </div>
        <DialogFooter className="justify-start">
          <DialogClose asChild>
            <Button onClick={handleChange} type="submit">
              Save
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
