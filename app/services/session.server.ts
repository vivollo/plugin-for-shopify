import prisma from "app/db.server";

export class SessionService {
  static async findById(id: string) {
    return await prisma.session.findUnique({ where: { id } });
  }

  static async findByIdOrFail(id: string) {
    const session = await this.findById(id);
    if (!session) throw new Error(`Session not found: ${id}`);
    return session;
  }

  static async update(id: string, data: any) {
    return await prisma.session.update({ where: { id }, data });
  }
}
