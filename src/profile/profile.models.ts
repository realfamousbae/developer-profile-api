import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType('ProfessionalLink')
export class ProfessionalLinkModel {
  @Field()
  declare label: string;

  @Field()
  declare url: string;
}

@ObjectType('Skill')
export class SkillModel {
  @Field()
  declare name: string;

  @Field()
  declare category: string;
}

@ObjectType('Experience')
export class ExperienceModel {
  @Field()
  declare company: string;

  @Field()
  declare position: string;

  @Field()
  declare startPeriod: string;

  @Field(() => String, { nullable: true })
  declare endPeriod: string | null;

  @Field()
  declare isCurrent: boolean;

  @Field(() => [String])
  declare achievements: string[];
}

@ObjectType('Project')
export class ProjectModel {
  @Field()
  declare name: string;

  @Field()
  declare description: string;

  @Field()
  declare url: string;

  @Field(() => String, { nullable: true })
  declare repositoryUrl: string | null;

  @Field(() => [String])
  declare technologies: string[];
}

@ObjectType('Profile')
export class ProfileModel {
  @Field()
  declare name: string;

  @Field()
  declare headline: string;

  @Field()
  declare description: string;

  @Field(() => [ProfessionalLinkModel])
  declare links: ProfessionalLinkModel[];

  @Field(() => [SkillModel])
  declare skills: SkillModel[];

  @Field(() => [ExperienceModel])
  declare experience: ExperienceModel[];

  @Field(() => [ProjectModel])
  declare projects: ProjectModel[];
}
