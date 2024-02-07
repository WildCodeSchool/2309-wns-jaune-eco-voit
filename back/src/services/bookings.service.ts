import { In, Like, Repository } from "typeorm";
import datasource from "../db";
import { validate } from "class-validator";

export default class AdService {
  db: Repository<Ad>;

  constructor() {
    this.db = datasource.getRepository(Ad);
  }

  async list(filters?: QueryAd) {
    const ads = await this.db.find({
      relations: {
        category: true,
        tags: true,
      },
      where: {
        tags: {
          id:
            filters?.tagsId && filters.tagsId.length > 0
              ? In(
                  filters.tagsId
                    .filter((t): t is string => typeof t === "string")
                    .map((t: string) => +t)
                )
              : undefined,
        },
        category: { id: filters?.catId ? +filters.catId : undefined },
        title: filters?.title ? Like(`%${filters.title}%`) : undefined,
        owner: filters?.owner ? Like(`%${filters.owner}%`) : undefined,
        location: filters?.location ? Like(`%${filters.location}%`) : undefined,
      },
    });
    return ads;
  }

  async findById(id: number) {
    const ad = await this.db.findOne({
      where: { id },
      relations: { category: true, tags: true },
    });
    return ad;
  }

  async create(body: CreateAdInput) {
    const tagsIds = body.tagsId;
    const tagsList = tagsIds?.reduce<Promise<Tag[]>>(
      async (
        previousValue: Promise<Tag[]>,
        currentValue: InputMaybe<string>
      ) => {
        if (!currentValue) return previousValue; // Return the promise here
        const acc = await previousValue;
        const tag: Tag | "" =
          currentValue && (await new TagService().findById(+currentValue));
        if (tag) {
          return [...acc, tag];
        }
        return acc;
      },
      Promise.resolve([])
    );
    const tags = await tagsList;
    delete body.tagsId;
    const { category, ...rest } = body;

    let newAd: Ad;

    if (category) {
      const categoryToLink = await new CategoryServices().findById(+category);
      newAd = this.db.create({
        ...rest,
        category: categoryToLink,
        tags,
      });
    } else {
      newAd = this.db.create({
        ...rest,
        tags,
      });
    }

    const errors = await validate(newAd);
    if (errors.length !== 0) {
      console.log(errors);
      throw new Error("Something wrong with the validation");
    }
    return await this.db.save(newAd);
  }

  static async save(newAd: Ad) {
    return await newAd.save();
  }

  async delete(id: number) {
    const adToDelete = await this.db.findOneBy({ id });
    if (!adToDelete) {
      throw new Error("Data not found");
    }
    await this.db.remove(adToDelete);
    return adToDelete;
  }

  async update(id: number, body: IUpdateAd) {
    const adToUpdate = await this.db.findOneBy({ id });
    if (!adToUpdate) {
      throw new Error("Data not found");
    }
    const adUpdated = this.db.merge(adToUpdate, body);
    const errors = await validate(adToUpdate);

    if (errors.length !== 0) {
      throw new Error("Something wrong with the body");
    }

    const adSaved = await this.db.save(adUpdated);

    return await this.db.findOne({
      where: { id: adSaved.id },
      relations: { category: true, tags: true },
    });
  }
}
