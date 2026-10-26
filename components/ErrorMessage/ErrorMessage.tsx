import css from './ErrorMessage.module.css';

export default function ErrorMessage() {
  return <p className={css.text}>Could not load notes. Check your connection and try again.</p>;
}
