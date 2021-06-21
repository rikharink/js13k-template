import {
  Matrix4x4,
  create,
  copy,
  multiply,
  from_rotation_translation_scale,
} from "../math/matrix4x4";
import { Quaternion } from "../math/quaternion";
import { Vector3 } from "../math/vector3";
import { Identifiable } from "../mixins/identifiable";

export class Scene {}

export interface NodeSource {
  getMatrix(out: Matrix4x4): void;
}

export class RotationTranslationScaleSource implements NodeSource {
  public rotation: Quaternion = [0, 0, 0, 1];
  public translation: Vector3 = [0, 0, 0];
  public scale: Vector3 = [1, 1, 1];

  getMatrix(out: Matrix4x4) {
    from_rotation_translation_scale(
      out,
      this.rotation,
      this.translation,
      this.scale
    );
  }
}

class _Node {
  children: Array<_Node> = [];
  _id!: string;
  private _parent?: _Node;
  private _localMatrix: Matrix4x4 = create();
  private _worldMatrix: Matrix4x4 = create();
  private _source: NodeSource;

  public constructor(source: NodeSource) {
    this._source = source;
  }

  public get parent(): _Node | undefined {
    return this._parent;
  }

  public set parent(parent: _Node | undefined) {
    if (this._parent) {
      let ndx = this._parent.children.indexOf(this);
      if (ndx >= 0) {
        this._parent.children.splice(ndx, 1);
      }
    }
    if (parent) {
      parent.children.push(this);
    }
    this._parent = parent;
  }

  public updateWorldMatrix(parentWorldMatrix?: Matrix4x4) {
    if (this._source) {
      this._source.getMatrix(this._localMatrix);
    }
    if (parentWorldMatrix) {
      multiply(this._worldMatrix, this._localMatrix, parentWorldMatrix);
    } else {
      copy(this._worldMatrix, this._localMatrix);
    }
    this.children.forEach((c) => c.updateWorldMatrix(this._worldMatrix));
  }
}

export const Node = Identifiable(_Node);
