import {Clear} from '@mui/icons-material';
import MuiAutocomplete, {
  type AutocompleteInputChangeReason as MuiAutocompleteInputChangeReason,
  type AutocompleteProps as MuiAutocompleteProps,
} from '@mui/material/Autocomplete';
import type {SxProps, Theme} from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import {type UseAutocompleteProps as MuiUseAutocompleteProps} from '@mui/material/useAutocomplete';
import {
  useMemo,
  type ClipboardEventHandler,
  type FC,
  type SyntheticEvent,
} from 'react';
import {STRING_EMPTY} from '~/shared/constants';
import json from '~/shared/i18n/locales/ja.json';

type TMuiUseAutocompleteProps = MuiUseAutocompleteProps<
  {id: number; label: string; color: string},
  false,
  false,
  true
>;

type TAutocompleteProps = MuiAutocompleteProps<
  {id: number; label: string; color: string},
  false,
  false,
  true
>;

interface IAutocompleteProps {
  hashtags: {id: number; name: string; color: string}[];
  open: boolean;
  setOpen: (open: boolean) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  selectedHashtags: {label: string; color: string}[];
  setSelectedHashtags: (value: {label: string; color: string}[]) => void;
}

const autocompleteStyles: SxProps<Theme> = {
  width: {
    xs: '100%',
    md: 224,
  },
  '& .MuiAutocomplete-inputRoot': {
    flexWrap: 'nowrap',
    bgcolor: '#ffffff',
    paddingX: 1,
  },
};

export const Autocomplete: FC<IAutocompleteProps> = ({
  hashtags,
  open,
  setOpen,
  inputValue,
  setInputValue,
  selectedHashtags,
  setSelectedHashtags,
}) => {
  const hashtagOptions = useMemo(
    () =>
      hashtags?.map(hashtag => ({
        id: hashtag.id,
        label: hashtag.name,
        color: hashtag.color,
      })) || [],
    [hashtags],
  );

  function handleInputChange(
    event: SyntheticEvent,
    input: string | {label: string; value: string} | null,
    reason: MuiAutocompleteInputChangeReason,
  ): void {
    event?.preventDefault();

    if (input === null) return;

    let content = '';

    if (typeof input === 'string') {
      content = input.trim();
      if (content === '#') {
        // Show all hashtags when exactly "#" is entered
        setOpen(true);
      } else if (content.startsWith('#')) {
        setOpen(true);
      }
    } else if (typeof input === 'object') {
      content = input.value;
    }

    setInputValue(content);

    if (reason === 'reset') {
      setInputValue(STRING_EMPTY);
      setOpen(false);
    }
  }

  const handleChange: TMuiUseAutocompleteProps['onChange'] = (
    event,
    input,
    reason,
  ) => {
    event?.preventDefault();
    if (
      typeof input === 'string' &&
      !selectedHashtags.find(x => x.label === input.trim())
    ) {
      const hashtag = hashtags!?.find(x => x.name === input);
      setSelectedHashtags([
        ...selectedHashtags,
        {label: hashtag?.name!, color: hashtag?.color!},
      ]);
    }

    if (
      typeof input === 'object' &&
      input &&
      !selectedHashtags.find(x => x.label === input.label)
    ) {
      const hashtag = hashtags!?.find(x => x.id === input.id);
      setSelectedHashtags([
        ...selectedHashtags,
        {label: hashtag?.name!, color: hashtag?.color!},
      ]);
    }

    if (reason === 'selectOption' && open) {
      setOpen(false);
      if (inputValue !== STRING_EMPTY) setInputValue(STRING_EMPTY);
    }
  };

  const handlePaste: ClipboardEventHandler = event => {
    event.preventDefault();
    const input = event.clipboardData.getData('text/plain');

    // Early return if input is empty
    if (!input) return;

    // Set input value
    setInputValue(input);

    // Show all options when exactly "#" is pasted or when input starts with "#"
    if (input === '#' || input.startsWith('#')) {
      setOpen(true);
    }
  };

  const filterOptions: TMuiUseAutocompleteProps['filterOptions'] = (
    options,
    state,
  ) => {
    // Show all options when inputValue is exactly "#"
    if (state.inputValue === '#') {
      return options;
    }
    // Default filtering behavior for MUI Autocomplete
    return options.filter(option =>
      option.label
        .toLowerCase()
        .includes(state.inputValue.toLowerCase().replace('#', '')),
    );
  };

  const renderOption: TAutocompleteProps['renderOption'] = (
    {key, ...otherProps},
    option,
  ) => (
    <li key={key} {...otherProps}>
      <span style={{color: option.color}} className="text-sm">
        {option.label}
      </span>
    </li>
  );

  return (
    <MuiAutocomplete
      sx={autocompleteStyles}
      options={hashtagOptions}
      filterOptions={filterOptions}
      filterSelectedOptions={true}
      renderInput={params => (
        <TextField
          {...params}
          placeholder={json.label.hashtag}
          variant="standard"
        />
      )}
      renderOption={renderOption}
      onInputChange={handleInputChange}
      onChange={handleChange}
      onPaste={handlePaste}
      open={open}
      onBlur={() => setOpen(false)}
      inputValue={inputValue}
      slotProps={{
        chip: {
          sx: {
            bgcolor: 'transparent',
          },
          clickable: false,
          deleteIcon: <Clear />,
        },
      }}
      disablePortal
      freeSolo
    />
  );
};
