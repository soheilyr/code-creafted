interface BlogType {
  id: string;
  title: string;
  content: string;
  imageUrl: string | null;
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
  authorId: string;
  categoryId: string | null;
}
