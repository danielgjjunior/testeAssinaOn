import styles from './Avatar.module.css';

interface AvatarProps {
  name: string;
}

const letterColors: Record<string, string> = {
  A: "#FF5733", B: "#33FF57", C: "#3357FF", D: "#FF33A8", E: "#FFC133",
  F: "#8D33FF", G: "#33FF57", H: "#33FF83", I: "#FF8C33", J: "#FF3333",
  K: "#33FFBD", L: "#FF33D6", M: "#FF6E33", N: "#FF8D33", O: "#DFFF33",
  P: "#FF33F5", Q: "#A833FF", R: "#FF338D", S: "#57FF33", T: "#FF9E33",
  U: "#804DFF", V: "#FFC733", W: "#33FF66", X: "#FF333E", Y: "#F5FF33",
  Z: "#FF33C7"
};

export default function Avatar(props: AvatarProps) {
  const initials = props.name.charAt(0).toUpperCase();
  const backgroundColor = letterColors[initials] || "#333333"; // Cor padrão caso a letra não esteja mapeada

  return (
    <div className={styles.profilePhotoDiv}>
      <div className={styles.initialContainer} style={{ backgroundColor }}>
        <span className={styles.initial}>{initials}</span>
      </div>
    </div>
  );
}
