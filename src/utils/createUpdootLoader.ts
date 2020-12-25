import DataLoader from "dataloader";
import { Updoot } from "../entities/Updoot";

export const createUpdootLoader = () =>
  new DataLoader<{ postId: number }, Updoot[]>(async (keys) => {
    const updoots = await Updoot.findByIds(keys as any);

    return keys.map((key) =>
      updoots.filter((updoot) => updoot.postId === key.postId)
    );
  });
