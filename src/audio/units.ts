export const C = 0;
type C = 0;
export const Cs = 1;
type Cs = 1;
export const Df = 1;
type Df = 1;
export const D = 2;
type D = 2;
export const Ds = 3;
type Ds = 3;
export const E = 4;
type E = 4;
export const F = 5;
type F = 5;
export const Fs = 6;
type Fs = 6;
export const Gf = 6;
type Gf = 6;
export const G = 7;
type G = 7;
export const Gs = 8;
type Gs = 8;
export const Af = 8;
type Af = 8;
export const A = 9;
type A = 9;
export const As = 10;
type As = 10;
export const Bf = 10;
type Bf = 10;
export const B = 11;
type B = 11;

export type Note =
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
  | Af
  | A
  | As
  | Bf
  | B;

export type Octave = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
export type Tone = { note: Note; octave: Octave };
export type Frequency = number;
export type Seconds = number;
export type Milliseconds = number;
export type Index = number;
export type NormalRange = number;
