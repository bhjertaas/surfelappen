import type { OptionTexts } from '../../content/missions/text-types.ts';
import type { OptionId, ThreeOptions } from '../../content/types.ts';
import { useI18n } from '../../i18n/i18n.ts';

interface Props {
  options: ThreeOptions;
  labels: OptionTexts;
  labelledBy: string;
  disabled: boolean;
  onChoose: (id: OptionId) => void;
}

/** Three answers in a fixed order, lettered so a helper can say "press B" (FR-04). */
export function OptionButtons({ options, labels, labelledBy, disabled, onChoose }: Props) {
  const { m } = useI18n();
  return (
    <fieldset class="options" aria-labelledby={labelledBy}>
      {options.map((option, i) => (
        <button
          key={option.id}
          type="button"
          class="option"
          disabled={disabled}
          onClick={() => onChoose(option.id)}
        >
          <span class="option__letter">{m.linkInspect.optionLetters[i]}</span>{' '}
          <span class="option__label">{labels[option.id]}</span>
        </button>
      ))}
    </fieldset>
  );
}
