using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WebAPICore5_0W.Models;

namespace WebAPICore5_0W.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TripsController : ControllerBase
    {
        private readonly OrdersTripsAppDBContext _context;

        public TripsController(OrdersTripsAppDBContext context)
        {
            _context = context;
        }

        // GET: api/Trips
        //[HttpGet]
        public async Task<IEnumerable<Trip>> GetTrips(string startLocation, string finishLocation)
        {
            IEnumerable<Trip> TripsList = await _context.Trips.ToListAsync();

            if (!String.IsNullOrEmpty(startLocation) && !String.IsNullOrEmpty(finishLocation))
            {
                TripsList = await _context.Trips.Where(p => p.StartLocation.Contains(startLocation))
                                                .Where(p => p.FinishLocation.Contains(finishLocation))
                                                .ToListAsync();
            }
            else if (!String.IsNullOrEmpty(startLocation))
            {
                TripsList = await _context.Trips.Where(p => p.StartLocation.Contains(startLocation)).ToListAsync();
            }
            else if (!String.IsNullOrEmpty(finishLocation))
            {
                TripsList = await _context.Trips.Where(p => p.FinishLocation.Contains(finishLocation)).ToListAsync();
            }
            return TripsList;
        }

        // GET: api/Trips/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Trip>> GetTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);

            if (trip == null)
            {
                return NotFound();
            }

            return trip;
        }

        // PUT: api/Trips/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        //public async Task<IActionResult> PutTrip(int id, Trip trip)
        public async Task<ActionResult<Trip>> PutTrip(int id, Trip trip)
        {
            if (id != trip.IdTrip)
            {
                return BadRequest();
            }

            _context.Entry(trip).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!TripExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }
            return trip;
            //return NoContent();
        }

        // POST: api/Trips
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Trip>> PostTrip(Trip trip)
        {
            _context.Trips.Add(trip);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetTrip", new { id = trip.IdTrip }, trip);
        }

        // DELETE: api/Trips/5
        [HttpDelete("{id}")]

        public async Task<ActionResult<Trip>> DeleteTrip(int id)
        //public async Task<IActionResult> DeleteTrip(int id)
        {
            var trip = await _context.Trips.FindAsync(id);
            if (trip == null)
            {
                return NotFound();
            }

            _context.Trips.Remove(trip);
            await _context.SaveChangesAsync();
            return trip;
            //return NoContent();
        }

        private bool TripExists(int id)
        {
            return _context.Trips.Any(e => e.IdTrip == id);
        }
    }
}
