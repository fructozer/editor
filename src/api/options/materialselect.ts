import type { SvelteComponent } from "svelte";
import type { ComponentOption }     from "$api/options/options";
import MaterialSelectOption     from "$components/options/MaterialSelectOption.svelte";
import type { YAMLObject }      from "$api/yaml";
import { Requirements }         from "$api/options/options";

export default class MaterialSelect extends Requirements implements ComponentOption {
  component: typeof SvelteComponent = MaterialSelectOption;
  data                              = { material: "Dirt", any: false };
  tooltip: string | undefined       = undefined;

  constructor(any = true, def?: string) {
    super();
    this.data.any = any;
    if (def) this.data.material = def;
  }

  setTooltip = (tooltip: string): MaterialSelect => {
    this.tooltip = tooltip;
    return this;
  };

  clone = (): ComponentOption => {
    const select         = new MaterialSelect();
    select.data.material = this.data.material;
    select.data.any      = this.data.any;
    return select;
  };

  getData = (): { [key: string]: any } => {
    const data: { [key: string]: any } = {};
    data.material                      = this.data.material;

    return data;
  };

  deserialize = (yaml: YAMLObject) => this.data.material = yaml.get<string, string>("material", "Dirt");
}