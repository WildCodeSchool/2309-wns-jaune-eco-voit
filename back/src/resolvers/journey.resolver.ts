import { Arg, Mutation, Query, Resolver } from "type-graphql";
import JourneysService from "../services/journeys.service";

import { JourneyEntity, CreateJourneyInput, UpdateJourneyInput } from "../entities/journey.entity";

@Resolver()
export class JourneyResolver {
  // LIST ALL JOURNEYS
  @Query(() => [JourneyEntity])
  async listJourneys() {
    const journeys = await new JourneysService().listJourneys();
    return journeys;
  }

  // FIND JOURNEY BY ID
  @Query(() => JourneyEntity)
  async findJourneyById(@Arg("id") id: string) {

    if (isNaN(+id)) {
      throw new Error('Invalid id');
    }

    const journey = await new JourneysService().findJourneyById(id);
    if (!journey) {
      throw new Error('Journey not found');
    }
    return journey;
  }

  // CREATE JOURNEY
  @Mutation(() => JourneyEntity)
  async createJourney(@Arg("data") data: CreateJourneyInput) {
    return await new JourneysService().createJourney(data);
  }

  // UPDATE JOURNEY
  @Mutation(() => JourneyEntity)
  async updateJourney(@Arg("id") id: string, @Arg("data") data: UpdateJourneyInput) {
    console.log('DATA', id);
    return await new JourneysService().updateJourney(id, data)
  }

  // CANCEL JOURNEY
  @Mutation(() => JourneyEntity)
  async cancelJourney(@Arg("id") id: string) {
    return await new JourneysService().cancelJourney(id);
  }
}