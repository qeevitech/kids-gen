import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { Loader2, Trash2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGetTrainedModels } from "../api/use-get-models";
import { formatDistance } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useDeleteModel } from "../api/use-delete-model";

export const TrainedModels = () => {
  const { ref, inView } = useInView();
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetTrainedModels(10);
  const { mutate: deleteModel, isPending: isDeleting } = useDeleteModel();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return (
      <div className="flex h-[200px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const models = data?.pages.flatMap((page) => page.models) ?? [];

  if (!models.length) {
    return (
      <div className="flex h-[200px] items-center justify-center text-center">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            You haven't trained any models yet
          </p>
          <p className="text-xs text-muted-foreground">
            Train your first model using the form in the "Train New" tab
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {models.map((model) => (
        <Card key={model.id} className="overflow-hidden">
          <CardHeader className="p-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">{model.modelName}</CardTitle>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    disabled={isDeleting}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your model and all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => deleteModel(model.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <CardDescription className="text-xs">
              {/* {formatDistance(new Date(model.created_at), new Date(), {
                addSuffix: true,
              })} */}
              Created {new Date(model.createdAt).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center justify-between">
              <Badge
                variant={
                  model.trainingStatus === "succeeded"
                    ? "success"
                    : model.trainingStatus === "failed"
                      ? "destructive"
                      : "secondary"
                }
                className="text-xs"
              >
                {model.trainingStatus === "succeeded"
                  ? "Ready to use"
                  : model.trainingStatus === "failed"
                    ? "Failed"
                    : "Training..."}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {model.gender}
              </span>
            </div>
          </CardContent>
        </Card>
      ))}

      <div ref={ref} className="mt-4 flex justify-center">
        {isFetchingNextPage ? (
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        ) : hasNextPage ? (
          <Button variant="outline" size="sm" onClick={() => fetchNextPage()}>
            Load More
          </Button>
        ) : null}
      </div>
    </div>
  );
};
