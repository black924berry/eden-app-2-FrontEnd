import { ComponentMeta, ComponentStory } from "@storybook/react";
import { faker } from "@faker-js/faker";
import { SkillVisualisationComp } from "./SkillVisualisationComp";
import { getSkills } from "../../../../../apps/storybook/mocks";
export default {
  title: "Components/SkillVisualisationComp",
  component: SkillVisualisationComp,
  argTypes: {},
} as ComponentMeta<typeof SkillVisualisationComp>;

const Template: ComponentStory<typeof SkillVisualisationComp> = (args) => (
  <SkillVisualisationComp {...args} />
);

export const Default = Template.bind({});

Default.args = {
  skills: getSkills(faker.datatype.number({ min: 2, max: 15, precision: 1 })),
};
