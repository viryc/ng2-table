# ng2-table  with edition options 
Fork of [ng2-table](https://github.com/valor-software/ng2-table) including a config object to render edition buttons.

- - -

## Documentation

Only included the aditional options of this fork.
For more information head to the [original docs](https://valor-software.com/ng2-table/)

### Inputs (Properties)

-`editConfig` (`?any`) - configuration of the edition cell
  - `title` (`?string`) - title of the header for the edition column
  - `className` (`?string|Array<string>`) - additional css classes that should be added to the edition column header
  - `edit` (`?any`) - configuration object for the edit button
    - `title` (`?string`) - content of the edit button
    - `icon` (`?string`) - css class for a icon inside the button
    - `className` (`?string|Array<string>`) - additional css classes that should be added to the edit button
  - `delete` (`?any`) - configuration object for the delete button
    - `title` (`?string`) - content of the delete button
    - `icon` (`?string`) - css class for a icon inside the button
    - `className` (`?string|Array<string>`) - additional css classes that should be added to the delete button
  - `select` (`?any`) - configuration object for the selection checkbox
    - `name` (`string`) - html name property for the checkboxes
    - `keyProperty` (`string`) - property of the row object that uniquely identifies it
    - `className` (`?string|Array<string>`) - additional css classes that should be added to the checkbox

### Outputs (Events)

- `tableChanged`: data change event handler
- `cellClicked`: onclick event handler
- `editClicked`: edit button event handler. It does not handles the edition, just outputs the row on it which was triggered.
- `deleteClicked`: delete button event handler. It does not handles the deletion, just outputs the row on it which was triggered
- `selectChange`: row selection change handler. Outputs the row and a a boolean telling if its selected or not.
- `sortChanged`: column sorting change handler. Outputs the changed column
- `filterChanged`: column filter change handler. Outputs the changed column

## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/lluchmk/ng2-table/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-table/blob/master/LICENSE) file for the full text)
