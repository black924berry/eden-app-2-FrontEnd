import { render } from "../../../utils/jest-apollo";
import { RequirementsModal } from ".";
import { mockCompanyData } from "./mockData";

const rangeNumbers: number[] = [];

for (let i = 0; i < 500; i++) {
  rangeNumbers.push(Math.floor(Math.random() * 80) + 1);
}

describe("RequirementsModal", () => {
  it("renders without throwing", () => {
    const { container } = render(
      <RequirementsModal
        salaryData={rangeNumbers}
        companies={mockCompanyData}
        onClose={function (): void {
          throw new Error("Function not implemented.");
        }}
        onSubmit={function (data): void {
          console.log(data);

          throw new Error("Function not implemented.");
        }}
      />
    );

    expect(container).toBeInTheDocument();
  });
});
