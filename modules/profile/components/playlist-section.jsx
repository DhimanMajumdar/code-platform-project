"use client";

import React, { useState } from 'react';
import { List, Calendar, FileText, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Link from 'next/link';
import { cn } from '@/lib/utils';

const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "EASY":
      return "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-950 dark:text-green-300";
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 dark:bg-yellow-950 dark:text-yellow-300";
    case "HARD":
      return "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-950 dark:text-red-300";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const PlaylistsSection = ({ playlists }) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <List className="w-6 h-6 text-blue-500" />
            <CardTitle className="text-2xl">Playlists</CardTitle>
            <Badge variant="secondary">
              {playlists.length}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {playlists.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <List className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Playlists Created</h3>
              <p className="text-muted-foreground">Create your first playlist to organize your problems!</p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {playlists.map((playlist) => (
                <Card
                  key={playlist.id}
                  className="cursor-pointer hover:shadow-md hover:border-blue-400 dark:hover:border-blue-800 transition-all duration-200 bg-blue-50 dark:bg-blue-950/50 group"
                  onClick={() => setSelectedPlaylist(playlist)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                          {playlist.name}
                        </h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-2">
                          {playlist.description || "No description provided."}
                        </p>
                        <Badge variant="outline" className="bg-blue-100/50 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
                          {playlist.problems?.length || 0} {playlist.problems?.length === 1 ? 'problem' : 'problems'}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4 space-y-2">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        <span>Created {formatDate(playlist.createdAt)}</span>
                      </div>
                      {playlist.createdAt !== playlist.updatedAt && (
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>Updated {formatDate(playlist.updatedAt)}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Playlist Details Dialog */}
      <Dialog open={!!selectedPlaylist} onOpenChange={() => setSelectedPlaylist(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <List className="w-6 h-6 text-blue-500" />
              {selectedPlaylist?.name}
            </DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-2">
              {selectedPlaylist?.description || "No description provided."}
            </DialogDescription>
          </DialogHeader>

          <div className="mt-4">
            <h4 className="font-semibold text-sm text-muted-foreground mb-3 uppercase tracking-wider">
              Problems ({selectedPlaylist?.problems?.length || 0})
            </h4>

            {(!selectedPlaylist?.problems || selectedPlaylist.problems.length === 0) ? (
              <div className="text-center py-8 text-muted-foreground bg-muted/30 rounded-lg border border-dashed">
                No problems in this playlist yet. Go to the problems page to add some!
              </div>
            ) : (
              <ScrollArea className="max-h-[400px] pr-2">
                <div className="space-y-3">
                  {selectedPlaylist.problems.map(({ problem }) => (
                    <div
                      key={problem.id}
                      className="flex items-center justify-between p-4 rounded-xl border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold text-foreground text-base">
                          {problem.title}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge className={cn("text-xs font-semibold px-2 py-0.5", getDifficultyColor(problem.difficulty))}>
                            {problem.difficulty}
                          </Badge>
                          {problem.tags && problem.tags.length > 0 && (
                            <div className="flex gap-1">
                              {problem.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-[10px] px-1.5 py-0">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      <Link href={`/problem/${problem.id}`}>
                        <Button size="sm" className="gap-1.5 bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-600 dark:hover:bg-blue-500">
                          Solve
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PlaylistsSection;
