export class AudioNodeComposite extends AudioNode {
  public constructor(
    input: AudioNode /*  input  node to wrap  */,
    output?: AudioNode /*  output node to wrap  */
  );
  bypass(
    enable: boolean /*  whether to bypass the effects of the node chain  */
  ): void;
}
