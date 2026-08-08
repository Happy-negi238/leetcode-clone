import { toast } from "@/components/ui/toast";
import { useState } from "react";

export function usePlaylistActions() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isAddToPlaylistModalOpen, setIsAddToPlaylistModalOpen] =
    useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState(null);

  const handleCreatePlaylist = async (data: any) => {
    try {
      const response = await fetch("/api/playlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
        }),
      });

      const result = await response.json();

      if (result.success) {
        setIsCreateModalOpen(false);
        toast.add({
          type: "success",
          description: "Playlist created successfully!",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating playlist: ", error);
      toast.add({
        type: "error",
        description: error.message || `Failed creating playlist`,
      });
      return false;
    }
  };

  const handleAddToPlaylist = async (problemId: string, playlistId: string) => {
    try {
      const response = await fetch("/api/playlist/add-problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problemId, playlistId }),
      });

      const result = await response.json();
      if (result.success) {
        setIsAddToPlaylistModalOpen(false);
        toast.add({
          type: "success",
          description: "Problem added to playlist",
        });
        return true;
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error adding to playlist: ", error);
      toast.add({
        type: "error",
        description: error.message || "Failed to add problem to playlist",
      });
      return false;
    }
  };

  const openAddToPlaylist = async (problemId: any) => {
    setSelectedProblemId(problemId);
    setIsAddToPlaylistModalOpen(true);
  };

  return {
    isCreateModalOpen,
    openCreateModel: () => setIsCreateModalOpen(true),
    closeCreateModel: () => setIsCreateModalOpen(false),
    handleCreatePlaylist,

    isAddToPlaylistModalOpen,
    selectedProblemId,
    openAddToPlaylist,
    closeAddToPlaylistModel: () => setIsAddToPlaylistModalOpen(false),
    handleAddToPlaylist,
  };
}
