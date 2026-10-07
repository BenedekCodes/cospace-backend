import { Desk, Prisma } from "../generated/prisma/client";
import { DeskRepository } from "../repositories/desk.repository";
import { CreateDeskInput } from "../schemas/desk.schema";
import { ConflictError } from "../errors";

export class DeskService {
  constructor(private readonly repository: DeskRepository = new DeskRepository()) {}

  findAll(): Promise<Desk[]> {
    return this.repository.findAll();
  }

  async create(input: CreateDeskInput): Promise<Desk> {
    try {
      return await this.repository.create(input);
    } catch (err) {
      // Desk names are unique; surface the clash as a 409 instead of a 500.
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
        throw new ConflictError("A desk with that name already exists");
      }
      throw err;
    }
  }
}
