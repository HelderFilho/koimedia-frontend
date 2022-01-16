import {useState} from 'react'
import CommonDialog from "app/components/dialog/CommonDialog";
import Button from "@material-ui/core/Button";

import './index.css'
export default function ConfirmDialog({title, cancel, confirm}) {
    const [deleteDialog, setDeleteDialog] = useState(true)
console.log()
    return (
 
<CommonDialog
open = {deleteDialog}
onCLose = {() => setDeleteDialog(false)}
title = {title}
width = "sm"
>
<div className='confirmDialogButtons'> 
<Button
            variant="contained"
            color="warning"
            onClick={cancel}
          >    
        <span className="hidden sm:flex">Não</span>
</Button>
<Button
            variant="contained"
            color="primary"
            onClick={confirm}
          >    
        <span className="hidden sm:flex">sim</span>
</Button>
</div>

</CommonDialog>

)
}