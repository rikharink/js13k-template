export const A = 0;
type A = 0;
export const As = 1;
type As = 1;
export const Bf = 1;
type Bf = 1;
export const B = 2;
type B = 2;
export const C = 3;
type C = 3;
export const Cs = 4;
type Cs = 4;
export const Df = 4;
type Df = 4;
export const D = 5;
type D = 5;
export const Ds = 6;
type Ds = 6;
export const E = 7;
type E = 7;
export const F = 8;
type F = 8;
export const Fs = 9;
type Fs = 9;
export const Gf = 9;
type Gf = 9;
export const G = 10;
type G = 10;
export const Gs = 11;
type Gs = 11;
export const Af = 11;
type Af = 11;

export type Note =
  | A
  | As
  | Bf
  | B
  | C
  | Cs
  | Df
  | D
  | Ds
  | E
  | F
  | Fs
  | Gf
  | G
  | Gs
  | Af;

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Tone = { note: Note; octave: Octave };
export type Chord = Tone[];
export type Mode = "major" | "minor";
export type Frequency = number;
export type Seconds = number;
export type Milliseconds = number;
export type Index = number;
export type NormalRange = number;
