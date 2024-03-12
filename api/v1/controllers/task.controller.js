const Task = require('../models/task.model');

const paginationHelper = require('../../../helpers/pagination.helper');

//[GET] /api/v1/tasks
module.exports.index = async (req, res) => {
    const find = {
        deleted: false,
    };

    //Filter status
    if(req.query.status){
        find.status = req.query.status
    }
    //End Filter Status

    //Sort
    const sort = {};
    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue;
    }
    //End Sort

    //Pagination
    const countTasks = await Task.countDocuments(find);
    const objectPagination = paginationHelper(2, req.query, countTasks);
    //End Pagination

    //Search
    if (req.query.keyword) {
        const regex = new RegExp(req.query.keyword, "i");
        find.title = regex;
    }
    //End Search

    const tasks = await Task.find(find)
        .sort(sort)
        .limit(objectPagination.limitItems)
        .skip(objectPagination.skip);
    
    res.json({
        total: countTasks,
        data: tasks
    });
}

//[GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const id = req.params.id;

        const task = await Task.findOne({
            _id: id,
            deleted: false,
        });

        res.json(task);
    } catch (error) {
        res.json(error);
    }
}

//[PATCH] /api/v1/tasks/change-status/:id
module.exports.changeStatus = async (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        await Task.updateOne({
            _id: id,
            deleted: false,
        }, {
            status: status
        });

        res.json({
            code: 200,
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật trạng thái thất bại!"
        });
    } 
}

// [PATCH] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
    try {
        const {ids, key, value} = req.body;

        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: { $in: ids },
                    deleted: false,
                }, {
                    status: value
                });

                res.json({
                    code: 200,
                    message: "Cập nhật trạng thái thành công!"
                });
                break;
        
            default:
                res.json({
                    code: 400,
                    message: "Cập nhật thất bại!"
                })
                break;
        }
    } catch (error) {
        res.json({
            code: 400,
            message: "Cập nhật thất bại!"
        })
    }
}

module.exports.create = async (req, res) => {
    try {
        const newTask = new Task(req.body);
        const data = await newTask.save();
        res.json({
            code: 200,
            message: "Thêm thành công!",
            data: data
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Thêm thất bại!"
        });
    }
}

//[DELETE] /api/v1/tasks/delete/:id
module.exports.delete = async (req, res) => {
    try {
        await Task.updateOne({
            _id: req.params.id,
            deleted: false,
        }, {
            deleted: true,
            deletedAt: new Date()
        });

        res.json({
            code: 200,
            message: "Xóa thành công!",
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Xóa thất bại!"
        })
    }
}