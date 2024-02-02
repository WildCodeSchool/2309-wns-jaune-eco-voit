import { Repository } from "typeorm";
import { CreateRatingInput, RatingEntity } from "../entities/rating.entity";
import datasource from "../db";

export default class RatingServices {
  db: Repository<RatingEntity>;
  constructor() {
    this.db = datasource.getRepository(RatingEntity);
  }

  async createRating(data: CreateRatingInput) {
    const newRating = this.db.create(data);
    return await this.db.save(newRating);
  }

  async getAllByRaters(id: string) {
    const ratings = await this.db.find({
      where: { id },
      relations: { userRated: true },
    });
  }
}
