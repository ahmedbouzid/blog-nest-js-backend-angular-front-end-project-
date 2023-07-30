import { User } from "src/user/models/user.interface";

export interface BlogEntry {
    id?: number;
    title?: string;
    slug?: string;
    description?: string;
    body?: string;
    createdAt?: Date;
    updatedAt?: Date;
    likes?: number;
    author?: User;
    headerImage?: string; // Include headerImage property
    publishedDate?: Date; // Include publishedDate property
    isPublish?: boolean; // Include isPublish property
}