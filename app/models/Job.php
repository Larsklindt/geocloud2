<?php

namespace app\models;

class Job extends \app\inc\Model
{
    public function getAll($db)
    {
        $arr = array();
        if ($db) {
            $sql = "SELECT * FROM jobs WHERE db=:db ORDER BY id";
            $args = array(":db" => $db);
        } else {
            $sql = "SELECT * FROM jobs ORDER BY id";
            $args = array();
        }
        $res = $this->prepare($sql);
        try {
            $res->execute($args);
        } catch (\PDOException $e) {
            $response['success'] = false;
            $response['message'] = $e->getMessage();
            $response['code'] = 400;
            return $response;
        }
        while ($row = $this->fetchRow($res, "assoc")) {
            $arr[] = $row;
        }
        $response['success'] = true;
        $response['message'] = "Jobs fetched";
        $response['data'] = (sizeof($arr) > 0) ? $arr : null;
        return $response;
    }

    public function newJob($data, $db)
    {
        $sql = "INSERT INTO jobs (db, name, schema, url, cron, epsg, type, min, hour, dayofmonth, month, dayofweek, encoding, extra, delete_append, presql, postsql) VALUES(:db, :name, :schema, :url, :cron, :epsg, :type, :min, :hour, :dayofmonth, :month, :dayofweek, :encoding, :extra, :delete_append, :presql, :postsql)";
        $res = $this->prepare($sql);
        try {
            $res->execute(array(":db" => $db, ":name" => \app\inc\Model::toAscii($data->name, NULL, "_"), ":schema" => $data->schema, ":url" => $data->url, ":cron" => $data->cron, ":epsg" => $data->epsg, ":type" => $data->type, ":min" => $data->min, ":hour" => $data->hour, ":dayofmonth" => $data->dayofmonth, ":month" => $data->month, ":dayofweek" => $data->dayofweek, ":encoding" => $data->encoding, ":extra" => $data->extra, ":delete_append" => $data->delete_append, ":presql" => $data->presql, ":postsql" => $data->postsql));
        } catch (\PDOException $e) {
            $response['success'] = false;
            $response['message'] = $e->getMessage();
            $response['code'] = 400;
            return $response;
        }
        $cronInstall = $this->createCronJobs();
        if ($cronInstall !== true) {
            $response['success'] = false;
            $response['message'] = $cronInstall;
            $response['code'] = 400;
            return $response;
        }
        $response['success'] = true;
        $response['message'] = "Jobs created";
        return $response;
    }

    public function updateJob($data)
    {

        $sql = "UPDATE jobs SET name=:name, schema=:schema, url=:url, cron=:cron, epsg=:epsg, type=:type, min=:min, hour=:hour, dayofmonth=:dayofmonth, month=:month, dayofweek=:dayofweek, encoding=:encoding, extra=:extra, delete_append=:delete_append, presql=:presql, postsql=:postsql WHERE id=:id";
        $res = $this->prepare($sql);
        try {
            $res->execute(array(":name" => \app\inc\Model::toAscii($data->name, NULL, "_"), ":schema" => $data->schema, ":url" => $data->url, ":cron" => $data->cron, ":epsg" => $data->epsg, ":type" => $data->type, ":min" => $data->min, ":hour" => $data->hour, ":dayofmonth" => $data->dayofmonth, ":month" => $data->month, ":dayofweek" => $data->dayofweek, ":encoding" => $data->encoding, ":id" => $data->id, ":extra" => $data->extra, "delete_append" => $data->delete_append, "presql" => $data->presql, "postsql" => $data->postsql));
        } catch (\PDOException $e) {
            $response['success'] = false;
            $response['message'] = $e->getMessage();
            $response['code'] = 400;
            return $response;
        }
        $cronInstall = $this->createCronJobs();
        if ($cronInstall !== true) {
            $response['success'] = false;
            $response['message'] = $cronInstall;
            $response['code'] = 400;
            return $response;
        }
        $response['success'] = true;
        $response['message'] = "Jobs updated";
        return $response;
    }

    public function deleteJob($data)
    {
        $sql = "DELETE FROM jobs WHERE id=:id";
        $res = $this->prepare($sql);
        try {
            $res->execute(array(":id" => $data->id));
        } catch (\PDOException $e) {
            $response['success'] = false;
            $response['message'] = $e->getMessage();
            $response['code'] = 400;
            return $response;
        }
        $cronInstall = $this->createCronJobs();
        if ($cronInstall !== true) {
            $response['success'] = false;
            $response['message'] = $cronInstall;
            $response['code'] = 400;
            return $response;
        }
        $response['success'] = true;
        $response['message'] = "Job deleted";
        return $response;
    }

    public function runJob($id, $db)
    {
        $cmd = null;
        $jobs = $this->getAll($db);
        foreach ($jobs["data"] as $job) {
            if ($id == $job["id"]) {
                if (!$job["delete_append"]) $job["delete_append"] = "0";
                $cmd = " php " . __DIR__ . "/../scripts/get.php {$job["db"]} {$job["schema"]} {$job["name"]} \"{$job["url"]}\" {$job["epsg"]} {$job["type"]} {$job["encoding"]} {$job["id"]} {$job["delete_append"]} " . (base64_encode($job["extra"]) ?: "null") . " " . (base64_encode($job["presql"]) ?: "null") . " " . (base64_encode($job["postsql"]) ?: "null") . " > " . __DIR__ . "/../../public/logs/{$job["id"]}_scheduler.log\n";
                break;
            }
        }
        exec($cmd . ' 2>&1', $out, $err);
        $response['cmd'] = $cmd;
        $response['success'] = true;
        $response['message'] = "Job completed";
        return $response;
    }

    public function createCronJobs()
    {

        $jobs = $this->getAll(null);
        exec("crontab -r");
        foreach ($jobs["data"] as $job) {
            if (!$job["delete_append"]) $job["delete_append"] = "0";
            $cmd = "crontab -l | { cat; echo \"{$job["min"]} {$job["hour"]} {$job["dayofmonth"]} {$job["month"]} {$job["dayofweek"]} php " . __DIR__ . "/../scripts/get.php {$job["db"]} {$job["schema"]} {$job["name"]} \"\\\"\"" . urldecode($job["url"]) . "\"\\\"\" {$job["epsg"]} {$job["type"]} {$job["encoding"]} {$job["id"]} {$job["delete_append"]} " . (base64_encode($job["extra"]) ?: "null") . " " . (base64_encode($job["presql"]) ?: "null") . " " . (base64_encode($job["postsql"]) ?: "null") . " > " . __DIR__ . "/../../public/logs/{$job["id"]}_scheduler.log\n\"; } | crontab - 2>&1";
            $out = exec($cmd);
            if ($out) {
                return $out . " ({$job["id"]})";
            }
        }
        $this->createRapportJob();
        return true;
    }

    private function createRapportJob()
    {

        $cmd = "crontab -l | { cat; echo \"0 6 * * * php " . __DIR__ . "/../scripts/job_rapport.php \n\"; } | crontab - 2>&1";
        $out = exec($cmd);
        if ($out) {
            return $out;
        }

        return true;
    }
}