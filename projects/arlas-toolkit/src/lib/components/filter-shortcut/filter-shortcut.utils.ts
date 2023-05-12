import { WidgetConfiguration } from '../../tools/utils';

export interface FilterShortcutConfiguration {
  uuid: string;
  title: string;
  order: 1;
  component?: WidgetConfiguration;
}
