import { forwardRef, useCallback, useImperativeHandle, useState } from "react";
import { t } from "ttag";

import {
  EntityPickerModal,
  MiniPicker,
  type OmniPickerItem,
} from "metabase/common/components/Pickers";

import { ExternalMenuTarget } from "../shared/ExternalMenuTarget";
import type { SuggestionModel } from "../shared/types";
import type { EntitySearchOptions } from "../shared/useEntitySearch";
import type {
  BareSuggestionRendererProps,
  BareSuggestionRendererRef,
} from "../suggestionRenderer";

import type { MentionProps } from "./MetabotMentionExtension";

interface MetabotMentionSuggestionPropsBase {
  searchModels?: SuggestionModel[];
  searchOptions?: EntitySearchOptions;
  canFilterSearchModels?: boolean;
  canBrowseAll?: boolean;
}
export type MetabotMentionSuggestionProps = MetabotMentionSuggestionPropsBase &
  BareSuggestionRendererProps<unknown, MentionProps>;

const MetabotMentionSuggestionComponent = forwardRef<
  BareSuggestionRendererRef,
  MetabotMentionSuggestionProps
>(function MentionSuggestionComponent(
  {
    items: _items,
    command,
    editor,
    range: _range,
    query,
    searchModels,
    decorationNode,
    onClose,
  },
  ref,
) {
  const [isBrowsing, setIsBrowsing] = useState(false);

  const onSelectEntity = useCallback(
    (item: OmniPickerItem) => {
      command({
        id: item.id,
        model: item.model,
        label: item.name,
      });
    },
    [command],
  );

  const [isTrappingFocus, setIsTrappingFocus] = useState(false);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp" || event.key === "ArrowDown") {
        setIsTrappingFocus(true);
        return true;
      }
      if (event.key === "Escape") {
        onClose();
        return true;
      }
      setIsTrappingFocus(false);
      return false;
    },
  }));

  const searchModelsReal = searchModels?.filter(
    (model) =>
      model !== "database" &&
      model !== "action" &&
      model !== "segment" &&
      model !== "user",
  );

  return (
    <>
      <MiniPicker
        opened
        searchQuery={query}
        shouldShowLibrary
        trapFocus={isTrappingFocus}
        models={searchModelsReal ?? []}
        closeOnClickOutside={!isBrowsing}
        onChange={onSelectEntity}
        onClose={() => {
          if (isTrappingFocus) {
            setIsTrappingFocus(false);
            editor.commands.focus();
          } else {
            onClose();
          }
        }}
        onBrowseAll={() => {
          setIsBrowsing(true);
        }}
      >
        <ExternalMenuTarget element={decorationNode} />
      </MiniPicker>
      {isBrowsing && (
        <EntityPickerModal
          title={t`Mention an item`}
          models={searchModelsReal ?? []}
          onChange={(item) => {
            onSelectEntity(item);
            onClose();
          }}
          onClose={() => {
            setIsBrowsing(false);
            setIsTrappingFocus(false);
          }}
          searchQuery={query}
        />
      )}
    </>
  );
});

export const MetabotMentionSuggestionNew = MetabotMentionSuggestionComponent;

export const createMetabotMentionSuggestionNew = (
  outerProps: MetabotMentionSuggestionPropsBase,
) => {
  return forwardRef<BareSuggestionRendererRef, MetabotMentionSuggestionProps>(
    function MentionSuggestionWrapper(props, ref) {
      return (
        <MetabotMentionSuggestionNew {...props} ref={ref} {...outerProps} />
      );
    },
  );
};
