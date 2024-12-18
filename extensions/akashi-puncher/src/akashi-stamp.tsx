import { Action, ActionPanel, Form, getPreferenceValues } from "@raycast/api";
import { FormValidation, useForm } from "@raycast/utils";
import { STAMP_TYPE, StampType } from "./constants";
import { postStamp } from "./repositories/akashi/stampRepository";
import { STAMP_TYPE_LABELS } from "./constants/StampType";

type StampFormValues = {
  type: string;
};

const Main = () => {
  const { Domain, CompanyId, APIToken } = getPreferenceValues<Preferences.AkashiStamp>();

  const { handleSubmit, itemProps } = useForm<StampFormValues>({
    onSubmit: async (values) => {
      // FIXME: Form.Dropdownがstring型しか許容しないため、暫定的に無理やりキャストしている
      await postStamp(Domain, CompanyId, APIToken, values.type as unknown as StampType, "時刻");
    },
    validation: {
      type: FormValidation.Required,
    },
  });

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm title="打刻" onSubmit={handleSubmit} />
        </ActionPanel>
      }
    >
      <Form.Dropdown title="打刻種別" {...itemProps.type}>
        {Object.values(STAMP_TYPE).map((stampType) => {
          return (
            <Form.Dropdown.Item
              value={String(stampType)}
              title={STAMP_TYPE_LABELS.find((label) => label.value === stampType)?.label || ""}
              key={stampType}
            />
          );
        })}
      </Form.Dropdown>
    </Form>
  );
};

export default Main;
