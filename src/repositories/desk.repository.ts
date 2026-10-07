import { prisma } from "../utils/db";
import { Desk } from "../generated/prisma/client";
import { CreateDeskInput } from "../schemas/desk.schema";

export class DeskRepository {
  findAll(): Promise<Desk[]> {
    return prisma.desk.findMany({ orderBy: { name: "asc" } });
  }

  create(data: CreateDeskInput): Promise<Desk> {
    return prisma.desk.create({ data });
  }
}
