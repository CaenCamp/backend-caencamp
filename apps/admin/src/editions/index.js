import EditionIcon from '@material-ui/icons/People';

import { EditionList } from './List';
import { EditionEdit } from './Edit';
import { EditionCreate } from './Create';

export default {
    create: EditionCreate,
    edit: EditionEdit,
    icon: EditionIcon,
    list: EditionList,
    options: { label: 'Editions' },
};
