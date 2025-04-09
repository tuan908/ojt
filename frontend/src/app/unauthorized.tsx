import json from '~/shared/i18n/locales/ja.json';

export default function Unauthorized() {
  return <div>{json.error.unauthorized}</div>;
}
