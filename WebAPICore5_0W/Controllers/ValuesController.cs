using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAPICore5_0W.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ValuesController : ControllerBase
    {

        // GET: api/values/5
        [HttpGet("{id}")]
        public string  Get(int id)
        {
             return   "user";
        }

        // GET: api/values/5/4
        [HttpGet("{id}/{id2}")]
        public string Get(int id, int id2)
        {
            return $"id = {id} and id2 = {id2}";
        }

        //// GET: api/values?id=5&id2=4
        [HttpGet]
        public string Get2(int id, int id2)
        {
            return $"id = {id} and id2 = {id2}";
        }
    }
}
