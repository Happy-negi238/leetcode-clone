"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useProblemFilters } from "../hooks/use-problem-filters";
import { ProblemsFilters } from "./problem-filters";
import { ProblemsHeader } from "./problems-header";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePagination } from "../hooks/use-pagination";
import { ProblemRow } from "./problem-row";
import { ProblemsEmpty } from "./problem-empty";
import { ProblemsPagination } from "./problems-pagination";
import { usePlaylistActions } from "@/modules/playlists/hooks/use-playlist-action";
import { CreatePlaylistModel } from "@/modules/playlists/components/create-playlist";
import { AddToPlaylistModel } from "@/modules/playlists/components/add-to-playlist";

export const ProblemsTable = ({ problems = [], user }: any) => {
  const filters = useProblemFilters(problems);
  const pagination = usePagination(filters.filteredProblems);
  const playlist = usePlaylistActions();

  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      <ProblemsHeader onCreatePlaylist={playlist.openCreateModel} />
      <ProblemsFilters
        search={filters.search}
        onSearchChange={filters.setSearch}
        difficulty={filters.difficulty}
        onDifficultyChange={filters.setDifficulty}
        selectedTag={filters.selectedTag}
        onTagChange={filters.setSelectedTag}
        allTags={filters.allTags}
      />

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-25">Solved</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-30">Difficulty</TableHead>
                <TableHead className="w-50">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pagination.paginatedItems.length > 0 ? (
                pagination.paginatedItems.map((problem) => (
                  <ProblemRow
                    key={problem.id}
                    problem={problem}
                    user={user}
                    onDelete={() => {}}
                    onSave={playlist.openAddToPlaylist}
                  />
                ))
              ) : (
                <ProblemsEmpty />
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {pagination.showPagination && (
        <ProblemsPagination
          currentPage={pagination.currentPage}
          totalPages={pagination.totalPages}
          displayRange={pagination.displayRange}
          canGoPrevious={pagination.canGoPrevious}
          canGoNext={pagination.canGoNext}
          onPrevious={pagination.goToPreviousPage}
          onNext={pagination.goToNextPage}
        />
      )}

      <CreatePlaylistModel
        isOpen={playlist.isCreateModalOpen}
        onClose={playlist.closeCreateModel}
        onSubmit={playlist.handleCreatePlaylist}
      />

      <AddToPlaylistModel
        isOpen={playlist.isAddToPlaylistModalOpen}
        onClose={playlist.closeAddToPlaylistModel}
        onSubmit={playlist.handleAddToPlaylist}
        problemId={playlist.selectedProblemId}
      />
    </div>
  );
};
