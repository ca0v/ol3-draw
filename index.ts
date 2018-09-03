/**
 * Consider ways of breaking from this pattern of just proxying
 * and provides some useful out-of-the-box configurations
 * e.g. create() puts all available control in a top-right toolbar
 */
import { Draw } from "./ol3-draw/ol3-draw";
import { Button } from "./ol3-draw/ol3-button";
import { Delete } from "./ol3-draw/ol3-delete";
import { Modify } from "./ol3-draw/ol3-edit";
import { Translate } from "./ol3-draw/ol3-translate";
import { Select } from "./ol3-draw/ol3-select";
import { Note } from "./ol3-draw/ol3-note";
import { NavHistory } from "./ol3-draw/ol3-history";
import { WfsSync } from "./ol3-draw/services/wfs-sync";
import { Measurement } from "./ol3-draw/measure-extension";

export {
    Draw,
    Button,
    Delete,
    Modify,
    Translate,
    Select,
    Note,
    Measurement,
    NavHistory,
    WfsSync,
};
