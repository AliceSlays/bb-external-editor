


export async function main(ns: NS) {
interface IMyContentProps {
  name: string
}
ns.ui.openTail();
const MyContent = ({name}: IMyContentProps) => <span>Hello {name}</span>;
  ns.printRaw(<MyContent name="Your name"></MyContent>);
}